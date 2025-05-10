variable "table_name" {
  description = "The name of the DynamoDB table."
  type        = string
  
}
variable "table_name_prefix" {
  description = "The prefix for the DynamoDB table name."
  type        = string
  default     = ""
}
variable "billing_mode" {
  description = "The billing mode for the DynamoDB table."
  type        = string
  default     = "PAY_PER_REQUEST"
  
}
variable "environment" {
  description = "The environment for the DynamoDB table."
  type        = string
  default     = "dev"
  
}
variable "tags" {
  description = "Resource tags"
  type        = map(string)
}

variable "region" {
  type = string
}

variable "hash_key" {
  description = "The hash key for the DynamoDB table."
  type        = string
  default     = "id"
}

