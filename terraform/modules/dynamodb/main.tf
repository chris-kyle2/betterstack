resource "aws_dynamodb_table" "monitoring_table" {
    name = "${var.environment}-${var.region}-dynamodb-table"
    billing_mode = var.billing_mode
    hash_key = "id"

    attribute {
        name = "id"
        type = "S"
    }
    tags = var.tags
}