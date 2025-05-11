module "dynamodb"{
    source = "../../../modules/dynamodb"
    environment = var.environment
    region = var.region
    billing_mode = var.billing_mode
    table_name = "${var.environment}-${var.region}-${var.table_name_prefix}-users-dynamodb-table"
    table_name_prefix = var.table_name_prefix
    tags = var.dynamodb_tags
    hash_key = var.hash_key
    
}

module "endpoints_dynamodb" {
    source = "../../../modules/endpoints_dynamodb"
    environment = var.environment
    region = var.region
    table_name_prefix = var.table_name_prefix
    billing_mode = var.billing_mode
    hash_key = var.hash_key
    range_key = var.range_key
    tags = var.dynamodb_tags
}

module "fastapi_lambda" {
    source = "../../../modules/fastapi_lambda"
    environment = var.environment
    region = var.region
    function_name_prefix = var.function_name_prefix
    lambda_handler = var.lambda_handler
    lambda_runtime = var.lambda_runtime
    user_table_name = module.dynamodb.table_name
    endpoint_table_name = module.dynamodb.table_name
    depends_on = [
        module.dynamodb
    ]
}
