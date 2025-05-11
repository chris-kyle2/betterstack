output "cognito_lambda_arn" {
    value = aws_lambda_function.cognito_lambda.arn
}

output "cognito_lambda_name" {
    value = aws_lambda_function.cognito_lambda.function_name
}


