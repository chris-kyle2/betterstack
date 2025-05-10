variable "region" {
  type = string
  default = "us-east-1"
}

variable "table_name" {
  description = "The name of the DynamoDB table"
  type        = string
}
variable "environment" {
  description = "The environment for the DynamoDB table"
  type        = string
}
variable "billing_mode" {
  description = "The billing mode for the DynamoDB table"
  type        = string
  default     = "PAY_PER_REQUEST"
}
variable "dynamodb_tags" {
  description = "Resource tags"
  type        = map(string)
}
variable "table_name_prefix" {
  description = "The prefix for the DynamoDB table name."
  type        = string
  default     = "central-api"
}

variable "hash_key" {
  description = "The hash key for the DynamoDB table."
  type        = string
  default     = "user_id"
}







variable "lambda_handler" {
  description = "The handler for the Lambda function"
  type        = string
}
variable "lambda_runtime" {
  description = "The runtime for the Lambda function"
  type        = string
  default     = "python3.8"
}
variable "schedule_expression" {
  description = "The schedule expression for the Lambda function"
  type        = string
  default     = "rate(5 minutes)"
}
variable "lambda_role_name" {
  description = "The name of the IAM role for the Lambda function"
  type        = string
  default     = "lambda-role"
}
variable "lambda_assume_role_policy" {
  description = "The assume role policy for the Lambda function"
  type        = string
  default     = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}
variable "lambda_basic_execution_policy" {
  description = "The basic execution policy for the Lambda function"
  type        = string
  default     = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
variable "lambda_function_tags" {
    description = "Resource tags"
    type        = map(string)
}