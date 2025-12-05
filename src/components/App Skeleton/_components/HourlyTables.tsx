import { Card, Table, Text } from '@mantine/core';
import { Period } from '../../../../types/weather';
import { formatHour } from '../../../../lib/time/formatHour';
import { groupHourlyPeriodsByDay } from '../../../../lib/weather/groupHourlyPeriods';

interface HourlyTablesProps {
  periods?: Period[];
  maxHours?: number;
}

export const HourlyTables = ({ periods, maxHours = 48 }: HourlyTablesProps) => {
  if (!periods?.length) {
    return null;
  }

  const grouped = groupHourlyPeriodsByDay(periods, maxHours);

  return (
    <>
      {grouped.map(({ label, periods: groupedPeriods }) => (
        <Card key={label} shadow="sm" padding="md" radius="md" withBorder mb="25">
          <Card.Section>
            <Text size="lg" mt="md" mb="xs" ta="center">
              {label}
            </Text>
          </Card.Section>

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Time</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Rain Chance</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Temperature</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {groupedPeriods.map((period) => (
                <Table.Tr key={period.startTime}>
                  <Table.Td>{formatHour(period.startTime)}</Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    {period.probabilityOfPrecipitation?.value != null
                      ? `${period.probabilityOfPrecipitation.value}%`
                      : ''}
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    {period.temperature != null ? `${period.temperature}${period.temperatureUnit}` : ''}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      ))}
    </>
  );
};
