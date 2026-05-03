provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "student_tracker" {
  ami           = "ami-0abcdef1234567890" # replace with valid Ubuntu AMI
  instance_type = "t2.micro"

  user_data = file("install_docker.sh")

  tags = {
    Name = "StudentTracker-Docker"
  }
}