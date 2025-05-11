data "aws_iam_policy_document" "lambda_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "cognito_lambda_role" {
  name = "${var.environment}-${var.region}-${var.function_name_suffix}-cognito-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "cognito_lambda_policy_attachment" {
  role = aws_iam_role.cognito_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_access"{
    role      = aws_iam_role.cognito_lambda_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}



resource "aws_lambda_function" "cognito_lambda" {
    function_name = "${var.environment}-${var.region}-${var.function_name_suffix}-cognito-lambda"
    role = aws_iam_role.cognito_lambda_role.arn
    
    handler = var.handler
    runtime = var.runtime

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
        aws_iam_role_policy_attachment.cognito_lambda_policy_attachment,
        aws_iam_role_policy_attachment.lambda_dynamodb_access
    ]
    lifecycle {
        ignore_changes = [filename,source_code_hash]
    }

}
