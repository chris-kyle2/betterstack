resource "aws_dynamodb_table" "endpoints_table" {
  name         = "${var.environment}-${var.region}-${var.table_name_prefix}-endpoints-dynamodb-table"
  billing_mode = var.billing_mode

  hash_key = var.hash_key

  attribute {
    name = var.hash_key
    type = "S"
  }

  attribute {
    name = var.gsi_hash_key
    type = "S"
  }

  global_secondary_index {
    name            = var.gsi_name
    hash_key        = var.gsi_hash_key
    projection_type = "ALL"
  }

  tags = var.tags
}
