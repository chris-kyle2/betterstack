module "dynamodb"{
    source = "../../../modules/dynamodb"
    environment = var.environment
    region = var.region
    billing_mode = var.billing_mode
    table_name = "${var.environment}-${var.region}-dynamodb-table"
    tags = var.dynamodb_tags
    
}

module "lambda_function" {
    source = "../../../modules/lambda_function"
    function_name = "${var.environment}-${var.region}-lambda-function"
    environment = var.environment
    region = var.region
    lambda_handler = var.lambda_handler
    lambda_runtime = var.lambda_runtime
    table_name = var.table_name
    schedule_expression = var.schedule_expression
    tags = var.lambda_function_tags
    depends_on = [
        module.dynamodb
    ]

}
