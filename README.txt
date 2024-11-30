* Điều kiện tiên quyết khi tạo một EC2 base ban đầu:
- Keypair file : tạo trước cho mỗi region
- Security group: tạo trước cho mỗi region
- VPC: tạo trước cho mỗi region
- AMI tạo trước cho mỗi region (không copy AMI từ region này sang region khác vì khi tạo mới 
  sẽ không được tự động import public key => không SSH được)

- 