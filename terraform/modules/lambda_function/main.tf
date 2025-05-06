data "aws_iam_policy_document" "lambda_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}




resource "aws_iam_role" "lambda_role" {
    name = "${var.environment}-${var.region}-lambda-role"
        assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
    tags = {
        Environment = var.environment
    }
  
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution"{
    role       = aws_iam_role.lambda_role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_access"{
    role      = aws_iam_role.lambda_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_lambda_function" "lambda_function" {
    function_name = "${var.environment}-${var.region}-lambda-function"
    role = aws_iam_role.lambda_role.arn
    
    handler = var.lambda_handler
    runtime = var.lambda_runtime

    filename        = "${path.module}/empty.zip"
    source_code_hash = filebase64sha256("${path.module}/empty.zip")
    

    publish       = false
    package_type  = "Zip"

    environment {
        variables = {
            TABLE_NAME = var.table_name
        }
    }

    tags = {
        Environment = var.environment
    }
    depends_on = [
        aws_iam_role_policy_attachment.lambda_basic_execution,
        aws_iam_role_policy_attachment.lambda_dynamodb_access
    ]
    lifecycle {
        ignore_changes = [filename,source_code_hash]
    }

}

resource "aws_cloudwatch_event_rule" "lambda_execution_schedule"{
    name = "${var.environment}-lambda-schedule"
    schedule_expression = var.schedule_expression
    description = "Schedule for Lambda function execution"
    tags = {
        Environment = var.environment
    }
}

resource "aws_cloudwatch_event_target" "lambda_target"{
    rule = aws_cloudwatch_event_rule.lambda_execution_schedule.name
    target_id = "${var.environment}-lambda-target"
    arn = aws_lambda_function.lambda_function.arn
}

resource "aws_lambda_permission" "allow_cloudwatch"{
    statement_id = "${var.environment}-allow-cloudwatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.lambda_function.function_name
    principal = "events.amazonaws.com"
    source_arn = aws_cloudwatch_event_rule.lambda_execution_schedule.arn
    depends_on = [
        aws_cloudwatch_event_target.lambda_target
    ]
}