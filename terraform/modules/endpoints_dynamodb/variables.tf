# variables.tf

# Environment name (e.g., dev, prod, etc.)
variable "environment" {
  description = "The environment name (e.g., dev, prod)"
  type        = string
}

# AWS region (e.g., us-east-1, eu-west-1, etc.)
variable "region" {
  description = "AWS region where the table will be created"
  type        = string
}

# Prefix for table name (e.g., 'api', 'service', etc.)
variable "table_name_prefix" {
  description = "Prefix for the DynamoDB table name"
  type        = string
}

# Billing mode for DynamoDB table (PROVISIONED or PAY_PER_REQUEST)
variable "billing_mode" {
  description = "Billing mode for the DynamoDB table"
  type        = string
  default     = "PAY_PER_REQUEST"
}

# Hash key attribute (Primary key)
variable "hash_key" {
  description = "The attribute name for the partition key (hash key)"
  type        = string
  default     = "endpoint_id"
}

# GSI hash key (secondary index)
variable "gsi_hash_key" {
  description = "The attribute name for the GSI hash key"
  type        = string
  default     = "user_id"
}

# GSI name
variable "gsi_name" {
  description = "The name for the GSI (Global Secondary Index)"
  type        = string
  default     = "user_id-index"
}

# Tags for the DynamoDB table
variable "tags" {
  description = "Tags for the DynamoDB table"
  type        = map(string)
  default     = {}
}

