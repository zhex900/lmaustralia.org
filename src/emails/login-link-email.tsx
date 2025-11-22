import { getPayload } from 'payload'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Row,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { render } from '@react-email/render'
import payloadConfig from '@payload-config'
import { site } from '@/constants'

type LoginLinkSendProps = {
  email: string
  url: URL
}

export const send = async ({ email, url }: LoginLinkSendProps) => {
  const html = await render(<LoginLinkEmail url={url} />, { pretty: true })
  const payload = await getPayload({ config: payloadConfig })
  await payload.sendEmail({
    to: email,
    subject: `${site.description} - Login`,
    html,
  })
}

export const LoginLinkEmail = ({ url }: { url: URL }) => {
  return (
    <Tailwind config={{ theme: { extend: { colors: { brand: '#b83f1d' } } } }}>
      <Html>
        <Head />
        <Body className="font-sans bg-zinc-50 box-border p-6">
          <Preview>Login link for {site.name}</Preview>

          <Container className="box-border bg-white rounded-md p-6">
            <Section className="my-[40px] px-[32px] py-[40px]">
              <Row>
                <Column align="center">
                  <Heading className="text-black text-xl font-normal">{site.description}</Heading>
                </Column>
              </Row>
            </Section>
            <Section>
              <Button
                className="bg-brand text-white py-4 text-2xl font-semibold text-center rounded w-full"
                href={url.toString()}
              >
                Login
              </Button>
            </Section>
            <Text className="p-0 py-2 m-0 opacity-40">
              This link will only be valid for the next 15 minutes.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
