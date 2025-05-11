variable "environment" {
    description = "The environment to deploy the lambda function to"
    type = string
}


variable "function_name_suffix" {
    description = "The suffix to add to the function name"
    type = string
}


variable "handler" {
    description = "The handler for the lambda function"
    type = string
}


variable "runtime" {
    description = "The runtime for the lambda function"
    type = string
}


variable "table_name" {
    description = "The name of the table to access"
    type = string
}
variable "region" {
    description = "The region to deploy the lambda function to"
    type = string
}



