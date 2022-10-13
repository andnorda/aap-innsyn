import { Panel, Heading, BodyShort, LinkPanel, Accordion } from '@navikt/ds-react';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Dokument } from 'lib/types/types';
import { formatFullDate } from 'lib/utils/date';
import Link from 'next/link';

interface Props {
  dokumenter: Dokument[];
}

export const Dokumentoversikt = ({ dokumenter }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();
  return (
    <Panel border>
      <Heading level="2" size="medium" spacing>
        {formatMessage('dokumentoversikt.tittel')}
      </Heading>
      <BodyShort spacing>
        <Link href="#">{formatMessage('dokumentoversikt.ikkeSynligDokumentLink')}</Link>
      </BodyShort>
      <VerticalFlexContainer>
        {dokumenter.map((dokument) => (
          <Accordion key={dokument.dokumentId}>
            <Accordion.Item>
              <Accordion.Header>{dokument.tittel}</Accordion.Header>
              <Accordion.Content>
                <BodyShort spacing>Mottatt {formatFullDate(dokument.dato)}</BodyShort>
                <BodyShort spacing>
                  <Link
                    href={`/api/dokument/?journalpostId=${dokument.journalpostId}&dokumentId=${dokument.dokumentId}`}
                    target="_blank"
                  >
                    Last ned dokumentet
                  </Link>
                </BodyShort>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        ))}
      </VerticalFlexContainer>
    </Panel>
  );
};