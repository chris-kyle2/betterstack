resource "aws_dynamodb_table" "logs_table" {
  name         = "${var.environment}-${var.region}-${var.table_name_prefix}-logs-dynamodb-table"
  billing_mode = var.billing_mode
  hash_key     = var.hash_key
  

  # Define all attributes passed in the list
  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  # Add GSIs dynamically
  dynamic "global_secondary_index" {
    for_each = var.global_secondary_indexes
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      projection_type = global_secondary_index.value.projection_type


    }
  }

  tags = var.tags
}
