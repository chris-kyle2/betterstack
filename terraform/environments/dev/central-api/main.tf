module "dynamodb" {
  source            = "../../../modules/dynamodb"
  environment       = var.environment
  region            = var.region
  billing_mode      = var.billing_mode
  table_name        = "${var.environment}-${var.region}-${var.users_table_name_prefix}-users-dynamodb-table"
  table_name_prefix = var.users_table_name_prefix
  tags              = var.users_table_dynamodb_tags
  hash_key          = var.users_table_hash_key

}

module "endpoints_dynamodb" {
  source            = "../../../modules/endpoints_dynamodb"
  environment       = var.environment
  region            = var.region
  table_name_prefix = var.endpoints_table_name_prefix
  billing_mode      = var.billing_mode
  hash_key          = var.endpoint_table_hash_key
  gsi_hash_key      = var.gsi_hash_key
  gsi_name          = var.gsi_name
  tags              = var.endpoints_table_dynamodb_tags
}

module "fastapi_lambda" {
  source               = "../../../modules/fastapi_lambda"
  environment          = var.environment
  region               = var.region
  function_name_prefix = var.function_name_prefix
  lambda_handler       = var.lambda_handler
  lambda_runtime       = var.lambda_runtime
  user_table_name      = var.user_table_name
  endpoint_table_name  = var.endpoint_table_name
  dynamodb_table_name = var.logs_table_name
  cognito_region       = var.cognito_region
  cognito_user_pool_id = var.cognito_user_pool_id
  cognito_client_id    = var.cognito_client_id
  depends_on = [
    module.dynamodb,
    module.endpoints_dynamodb,
    module.logs_dynamodb
  ]
}

module "logs_dynamodb" {
  source                   = "../../../modules/logs_dynamodb"
  environment              = var.environment
  table_name_prefix        = var.logs_table_name_prefix
  region                   = var.region
  billing_mode             = var.billing_mode
  hash_key                 = var.logs_table_hash_key
  attributes               = var.attributes
  global_secondary_indexes = var.global_secondary_indexes
  tags                     = var.logs_table_dynamodb_tags
}

