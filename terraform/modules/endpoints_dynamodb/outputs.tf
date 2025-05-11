output "table_name" {
  value = aws_dynamodb_table.endpoints_table.name
}

output "table_arn" {
  value = aws_dynamodb_table.endpoints_table.arn
}