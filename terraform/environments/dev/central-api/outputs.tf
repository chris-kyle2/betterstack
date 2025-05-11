output "dynamodb_name" {
  description = "The name of the DynamoDB table"
  value       = module.dynamodb.table_name
  
}
output "dynamodb_arn" {
  description = "The ARN of the DynamoDB table"
  value       = module.dynamodb.table_arn
}
output "lambda_function_name" {
  description = "Name of the lambda function"
  value = module.fastapi_lambda.lambda_function_name
}

output "lambda_function_arn" {
  description ="ARN of the lambda function"
  value = module.fastapi_lambda.lambda_function_arn
}

output "endpoints_dynamodb_name" {
  description = "The name of the endpoints DynamoDB table"
  value = module.endpoints_dynamodb.table_name
}


