variable "function_name" {
  description = "The name of the Lambda function."
  type        = string
}
variable "lambda_handler" {
  description = "The handler for the Lambda function."
  type        = string
}
variable "lambda_runtime" {
  description = "The runtime for the Lambda function."
  type        = string
}
variable "environment" {
  description = "The environment for the Lambda function."
  type        = string
  default     = "dev"
}
variable "schedule_expression" {
  description = "The schedule expression for the Lambda function."
  type        = string
  default     = "rate(1 minutes)"
}
variable "endpoints_table_name" {
  description = "The name of the DynamoDB table for endpoints."
  type        = string
}
variable "logs_table_name" {
  description = "The name of the DynamoDB table for logs."
  type        = string
}
variable "tags"{
  description = "Resource tags"
  type = map(string)
}
variable "region" {
  type = string
}