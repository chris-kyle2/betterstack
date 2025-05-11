module "cognito_lambda" {
    source = "../../../modules/cognito_lambda"
    environment = var.environment
    function_name_suffix = var.function_name_suffix
    handler = var.handler
    runtime = var.runtime
    region = var.region
    table_name = var.table_name
}