variable "region" {
  type    = string
  default = "us-east-1"
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




#######   Endpoints DynamoDB Table Configuration Variables #########

variable "gsi_hash_key" {
  description = "The hash key for the global secondary index"
  type        = string
}

variable "gsi_name" {
  description = "The name for the global secondary index"
  type        = string
}
variable "endpoints_table_name_prefix" {
  description = "The prefix for the DynamoDB table name."
  type        = string
  default     = "central-api"
}
variable "endpoint_table_hash_key" {
  description = "The hash key for the DynamoDB table."
  type        = string
  default     = "endpoint_id"
}


variable "endpoints_table_dynamodb_tags" {
  description = "Resource tags"
  type        = map(string)
}




#######   Users DynamoDB Table Configuration Variables #########

variable "users_table_name_prefix" {
  description = "The prefix for the DynamoDB table name."
  type        = string
  default     = "cognito-users-table"
}

variable "users_table_hash_key" {
  description = "The hash key for the DynamoDB table."
  type        = string
  default     = "user_id"
}

variable "users_table_dynamodb_tags" {
  description = "Resource tags"
  type        = map(string)
}



########  Central API Lambda Function Configuration Variables #########

variable "lambda_handler" {
  description = "The handler for the Lambda function"
  type        = string
}

variable "lambda_runtime" {
  description = "The runtime for the Lambda function"
  type        = string
  default     = "python3.12"
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

variable "function_name_prefix" {
  description = "The prefix for the Lambda function name."
  type        = string
  default     = "central-api"
}



########  Logs DynamoDB Table Configuration Variables #########

variable "logs_table_name_prefix" {
  description = "The prefix for the DynamoDB table name."
  type        = string
  default     = "central-api"
}

variable "logs_table_hash_key" {
  description = "The hash key for the DynamoDB table."
  type        = string
  default     = "log_id"
}

variable "attributes" {
  description = "The attributes for the DynamoDB table."
  type = list(object({
    name = string
    type = string
  }))
}

variable "global_secondary_indexes" {
  description = "The global secondary indexes for the DynamoDB table."
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = optional(string)
    projection_type = string
  }))
}

variable "logs_table_dynamodb_tags" {
  description = "Resource tags"
  type        = map(string)
}






























