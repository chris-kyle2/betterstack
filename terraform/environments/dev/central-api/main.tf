module "dynamodb"{
    source = "../../../modules/dynamodb"
    environment = var.environment
    region = var.region
    billing_mode = var.billing_mode
    table_name = "${var.environment}-${var.region}-${var.table_name_prefix}-dynamodb-table"
    table_name_prefix = var.table_name_prefix
    tags = var.dynamodb_tags
    hash_key = var.hash_key
    
}

