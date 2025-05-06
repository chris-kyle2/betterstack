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
variable "table_name" {
  description = "The name of the DynamoDB table."
  type        = string
}
variable "tags"{
  description = "Resource tags"
  type = map(string)
}
variable "region" {
  type = string
}