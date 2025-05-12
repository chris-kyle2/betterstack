output "logs_table_name" {
  description = "Name of the logs DynamoDB table"
  value       = aws_dynamodb_table.logs_table.name
}

output "logs_table_arn" {
  description = "ARN of the logs DynamoDB table"
  value       = aws_dynamodb_table.logs_table.arn
}

