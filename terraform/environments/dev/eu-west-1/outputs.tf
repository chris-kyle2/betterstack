
output "function_name" {
  description = "Name of the lambda function"
  value = module.lambda_function.function_name
}

output "lambda_function_arn" {
  description ="ARN of the lambda function"
  value = module.lambda_function.function_arn
}