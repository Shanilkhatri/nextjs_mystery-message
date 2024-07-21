import { Html, Head, Body, Title, Text, Link } from 'react-email';

export const VerificationEmail = ({ username, otp }) => {
  return (
    <Html>
      <Head />
      <Body>
        <Title>Verify Your Account</Title>
        <Text>
          Hello {username},
        </Text>
        <Text>
          Please enter the following OTP to verify your account:
        </Text>
        <Text>
          <strong>{otp}</strong>
        </Text>
        {/* <Link href={`https://example.com/verify-email?otp=${otp}`}>
          Click here to verify your account
        </Link> */}
        <Text>
          If you did not request this email, please ignore it.
        </Text>
      </Body>
    </Html>
  );
};

export default VerificationEmail;