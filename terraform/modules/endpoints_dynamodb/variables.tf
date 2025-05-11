variable "environment" {
  type = string
  description = "The environment to deploy the table to"
}

variable "region" {
  type = string
  description = "The region to deploy the table to"
}

variable "table_name_prefix" {
  type = string
  description = "The prefix for the table name"
}

variable "billing_mode" {
  type = string
  description = "The billing mode for the table"
}

variable "hash_key" {
  type = string
  description = "The hash key for the table"
}

variable "range_key" {
  type = string
  description = "The range key for the table"
}

variable "tags" {
  type = map(string)
  description = "The tags for the table"
}













