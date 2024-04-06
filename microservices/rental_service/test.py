import secrets
import string

def generate_alphanumeric_key(length):
  """Generates a random string with only lowercase and uppercase letters.

  Args:
      length: The desired length of the key.

  Returns:
      A string containing only lowercase and uppercase alphabetic characters.
  """

  # Define the allowed characters
  alphabet = string.ascii_letters

  # Generate random bytes and filter characters
  key_bytes = secrets.token_bytes(length // 2)  # Half the length for 2 chars per byte
  key = ''.join([alphabet[i % len(alphabet)] for i in key_bytes])

  return key

# Example usage with desired length
key_length = 40  # Adjust as needed
secret_key = generate_alphanumeric_key(key_length)

print(secret_key)
