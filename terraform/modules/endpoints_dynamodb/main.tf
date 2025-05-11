resource "aws_dynamodb_table" "endpoints_table" {
  name = "${var.environment}-${var.region}-${var.table_name_prefix}-endpoints-dynamodb-table"
  billing_mode = var.billing_mode
  hash_key = var.hash_key
  range_key = var.range_key
  attribute {
    name = var.hash_key
    type = "S"
  }
  attribute {
    name = var.range_key
    type = "S"
  }
  tags = var.tags
  
}
