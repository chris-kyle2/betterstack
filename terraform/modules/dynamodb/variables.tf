variable "table_name" {
  description = "The name of the DynamoDB table."
  type        = string
  
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
