resource "aws_dynamodb_table" "monitoring_table" {
    name = "${var.environment}-${var.region}-${var.table_name_prefix}-dynamodb-table"
    billing_mode = var.billing_mode
    hash_key = var.hash_key

    attribute {
        name = var.hash_key
        type = "S"
    }
    tags = var.tags
}