output "function_name" {
    description = "The name of the Lambda function."
    value       = aws_lambda_function.lambda_function.function_name
  
}
output "function_arn" {
    description = "The ARN of the Lambda function."
    value       = aws_lambda_function.lambda_function.arn
}
output "function_role" {
    description = "The IAM role ARN for the Lambda function."
    value       = aws_iam_role.lambda_role.arn
}
output "function_schedule"{
    description = "The schedule expression for the Lambda function."
    value       = aws_cloudwatch_event_rule.lambda_execution_schedule.schedule_expression
}