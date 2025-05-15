
variable "environment" {
  description = "The environment for the Lambda function."
  type        = string
  default     = "dev"
}

variable "region" {
  description = "The region for the Lambda function."
  type        = string
  default     = "us-east-1"
}

variable "function_name_prefix" {
  description = "The prefix for the Lambda function name."
  type        = string
  default     = "central-api"
}

variable "lambda_handler" {
  description = "The handler for the Lambda function."
  type        = string
  default     = "lambda_handler.handler"
}

variable "lambda_runtime" {
  description = "The runtime for the Lambda function."
  type        = string
  default     = "python3.12"
}

variable "user_table_name" {
  description = "The name of the DynamoDB table."
  type        = string
}

variable "endpoint_table_name" {
  description = "The name of the DynamoDB table."
  type        = string
}

variable "cognito_region" {
  description = "The region for the Cognito user pool."
  type        = string
}

variable "cognito_user_pool_id" {
  description = "The ID of the Cognito user pool."
  type        = string
}

variable "cognito_client_id" {
  description = "The ID of the Cognito client."
  type        = string
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table for logs."
  type        = string
}












