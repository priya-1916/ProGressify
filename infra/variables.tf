variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 instance type for Student Tracker app"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "AMI ID for Ubuntu Server (use latest valid AMI for your region)"
  type        = string
}

variable "key_name" {
  description = "SSH key pair name for EC2 access"
  type        = string
  default     = ""
}

variable "app_port" {
  description = "Port on which the application runs inside Docker"
  type        = number
  default     = 3000
}

variable "environment" {
  description = "Deployment environment (dev/test/prod)"
  type        = string
  default     = "dev"
}