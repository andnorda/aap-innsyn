import { Alert, BodyShort, Button, Heading, Label, PageHeader } from '@navikt/ds-react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { FieldErrors, useForm } from 'react-hook-form';
import { getAccessToken } from '../../auth/accessToken';
import { beskyttetSide } from '../../auth/beskyttetSide';
import { FormErrorSummary } from '../../components/FormErrorSummary/FormErrorSummary';
import { FileInput } from '../../components/Inputs/FileInput';
import { Section } from '../../components/Section/Section';
import { useFeatureToggleIntl } from '../../hooks/useFeatureToggleIntl';
import { OpplastetVedlegg, Vedleggskrav } from '../../types/types';
import { getVedleggskrav } from '../api/ettersendelse/vedleggskrav';
import * as styles from './Ettersendelse.module.css';

export const setErrorSummaryFocus = () => {
  const errorSummaryElement = document && document.getElementById('skjema-feil-liste');
  if (errorSummaryElement) errorSummaryElement.focus();
};
interface PageProps {
  vedleggskrav: Vedleggskrav[];
}

export interface FormValues {
  FORELDER: OpplastetVedlegg[];
  FOSTERFORELDER: OpplastetVedlegg[];
  STUDIESTED: OpplastetVedlegg[];
  ANNET: OpplastetVedlegg[];
}

const Index = ({ vedleggskrav }: PageProps) => {
  const { formatMessage } = useFeatureToggleIntl();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <>
      <PageHeader align="center" variant="guide">
        {formatMessage('ettersendelse.appTittel')}
      </PageHeader>
      <main className={styles.main}>
        <Section>
          <Heading level="2" size="medium" spacing>
            {formatMessage('ettersendelse.heading')}
          </Heading>
          <div>
            <Label spacing>{formatMessage('ettersendelse.manglerDokumentasjon')}</Label>
            {vedleggskrav.length > 0 && (
              <ul>
                {vedleggskrav.map((krav) => (
                  <li key={krav.dokumentasjonstype}>{krav.dokumentasjonstype}</li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        <form
          onSubmit={handleSubmit(
            (data) => {
              console.log(data);
            },
            (error) => {
              setErrorSummaryFocus();
            }
          )}
        >
          <FormErrorSummary
            id="skjema-feil-liste"
            errors={errors as FieldErrors}
            data-testid={'error-summary'}
          />
          {vedleggskrav.map((krav) => (
            <Section key={krav.dokumentasjonstype}>
              <FileInput
                heading={krav.dokumentasjonstype}
                description={krav.beskrivelse}
                name={krav.type}
                control={control}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
              />
            </Section>
          ))}

          <Section>
            <FileInput
              heading={formatMessage('ettersendelse.annenDokumentasjon.heading')}
              description={formatMessage('ettersendelse.annenDokumentasjon.description')}
              name="ANNET"
              control={control}
              setError={setError}
              clearErrors={clearErrors}
              errors={errors}
            />
          </Section>

          <Section>
            <Alert variant="warning">
              <Label spacing>{formatMessage('ettersendelse.warning.heading')}</Label>
              <BodyShort spacing>{formatMessage('ettersendelse.warning.description')}</BodyShort>
            </Alert>
          </Section>
          <div className={styles.buttonRow}>
            <div className={styles.buttonContainer}>
              <Button
                variant="secondary"
                onChange={() => {
                  console.log('avbryt');
                }}
              >
                {formatMessage('ettersendelse.buttons.secondary')}
              </Button>
              <Button variant="primary" type="submit">
                {formatMessage('ettersendelse.buttons.primary')}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const bearerToken = getAccessToken(ctx);
    const vedleggskrav = await getVedleggskrav(bearerToken);
    return {
      props: { vedleggskrav },
    };
  }
);

export default Index;
