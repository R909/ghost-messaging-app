import * as React from 'react';
import {
  Html, Head, Body, Container, Section,
  Text, Heading, Button, Hr, Row, Column,Tailwind
} from '@react-email/components';

interface EmailTemplateProps {
  username: string;
  verificationCode: string;
}

export function EmailTemplate({ username, verificationCode }: EmailTemplateProps) {
  const chars = verificationCode.split('');

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                ghost: {
                  bg: '#0a0612',
                  card: '#120d20',
                  purple: '#7c3aed',
                  lightpurple: '#9c8fff',
                  text: '#f0e8ff',
                  muted: '#c8b9ff',
                  border: 'rgba(147,112,219,0.2)',
                },
              },
            },
          },
        }}
      >
        <Body className="bg-[#0a0612] m-0 p-0 font-sans">
          <Container className="mx-auto my-10 w-full max-w-[520px]">

            <Section className="bg-[#120d20] rounded-2xl overflow-hidden border border-[rgba(147,112,219,0.2)]">

              <Section className="bg-gradient-to-br from-[#4c1d95] via-[#7c3aed] to-[#6d28d9] px-10 pt-8 pb-6">
                <Row>
                  <Column align="center">
                    <div className="w-16 h-16 rounded-full bg-white/15 border-2 border-white/25 flex items-center justify-center mx-auto mb-3">
                      <Text className="text-4xl leading-none m-0">👻</Text>
                    </div>
                    <Heading className="text-white text-2xl font-semibold tracking-wide m-0 text-center">
                      ghostmsg
                    </Heading>
                    <Text className="text-white/60 text-sm text-center m-0 mt-1">
                      anonymous messaging, honestly.
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section className="px-10 pt-9 pb-7">

                <Heading className="text-[#f0e8ff] text-xl font-semibold m-0 mb-3">
                  Hey {username} 👋
                </Heading>
                <Text className="text-[rgba(200,185,255,0.65)] text-sm leading-7 m-0 mb-6">
                  Welcome to{' '}
                  <span className="text-[#9c8fff] font-semibold">ghostmsg</span>
                  {' '}— where honesty lives anonymously. Use the
                  verification code below to confirm your email and
                  activate your account.
                </Text>

                <Hr className="border-[rgba(147,112,219,0.15)] my-6" />

                <Text className="text-[rgba(167,139,250,0.55)] text-[11px] font-semibold tracking-[1.5px] uppercase text-center m-0 mb-4">
                  Your Verification Code
                </Text>

                <Row className="mb-4">
                  {chars.map((char, i) => (
                    <Column key={i} align="center">
                      <div className="w-12 h-14 bg-[rgba(124,58,237,0.15)] border border-[rgba(147,112,219,0.35)] rounded-xl flex items-center justify-center mx-1">
                        <Text className="text-[#e8d8ff] text-2xl font-bold text-center m-0 leading-none">
                          {char}
                        </Text>
                      </div>
                    </Column>
                  ))}
                </Row>

                <Text className="text-[rgba(250,199,117,0.75)] text-xs text-center m-0 mb-6">
                  ⏱ This code expires in <strong>10 minutes</strong>
                </Text>

                <Hr className="border-[rgba(147,112,219,0.15)] my-6" />

                <Row>
                  <Column align="center">
                    <Button
                      href="https://ghostmsg.app/verify"
                      className="bg-[#7c3aed] text-white text-sm font-semibold px-9 py-3 rounded-xl no-underline text-center"
                    >
                      Verify My Account →
                    </Button>
                  </Column>
                </Row>

                <Section className="bg-[rgba(124,58,237,0.07)] border border-[rgba(147,112,219,0.15)] rounded-xl px-5 py-4 mt-6">
                  <Text className="text-[rgba(180,165,220,0.55)] text-xs leading-relaxed m-0">
                    🔒 If you did not create a ghostmsg account, you can
                    safely ignore this email. Your identity will never
                    be shared with anyone.
                  </Text>
                </Section>

              </Section>

              <Section className="bg-[#0d0918] border-t border-[rgba(147,112,219,0.1)] px-10 py-5">
                <Text className="text-[rgba(147,112,219,0.35)] text-xs text-center m-0 mb-2">
                  © {new Date().getFullYear()} ghostmsg · anonymous messaging, honestly.
                </Text>
                <Text className="text-[rgba(147,112,219,0.35)] text-xs text-center m-0">
                  <a href="#" className="text-[rgba(167,139,250,0.5)] no-underline">Privacy Policy</a>
                  {' · '}
                  <a href="#" className="text-[rgba(167,139,250,0.5)] no-underline">Terms</a>
                  {' · '}
                  <a href="#" className="text-[rgba(167,139,250,0.5)] no-underline">Unsubscribe</a>
                </Text>
              </Section>

            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}