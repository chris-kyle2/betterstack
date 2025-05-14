
module "lambda_function" {
    source = "../../../modules/lambda_function"
    function_name = "${var.environment}-${var.region}-lambda-function"
    environment = var.environment
    region = var.region
    lambda_handler = var.lambda_handler
    lambda_runtime = var.lambda_runtime
    endpoints_table_name = var.endpoints_table_name
    logs_table_name = var.logs_table_name
    schedule_expression = var.schedule_expression
    tags = var.lambda_function_tags
    

}
