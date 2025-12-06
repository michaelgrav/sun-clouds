import { Card, Table, Text } from '@mantine/core';
import { formatHour } from '../../../../lib/time/formatHour';
import { getWeatherEmoji } from '../../../../lib/weather/getWeatherEmoji';
import { groupHourlyPeriodsByDay } from '../../../../lib/weather/groupHourlyPeriods';
import { Period } from '../../../../types/weather';
import classes from './HourlyTables.module.css';

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
        <Card
          key={label}
          shadow="md"
          padding="md"
          radius="md"
          withBorder
          mb="25"
          className={classes.card}
        >
          <Card.Section>
            <Text size="lg" mt="md" mb="xs" ta="center" className={classes.title}>
              {label}
            </Text>
          </Card.Section>

          <Table
            striped
            highlightOnHover
            horizontalSpacing="sm"
            verticalSpacing="xs"
            className={classes.table}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Time</Table.Th>
                <Table.Th className={classes.conditionHeader}>Conditions</Table.Th>
                <Table.Th className={classes.numericHeader}>Rain Chance</Table.Th>
                <Table.Th className={classes.numericHeader}>Temperature</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {groupedPeriods.map((period) => {
                const emoji = getWeatherEmoji(period.icon, period.shortForecast);

                return (
                  <Table.Tr key={period.startTime}>
                    <Table.Td className={classes.timeCell}>
                      <span
                        className={classes.timeEmoji}
                        role="img"
                        aria-label={period.shortForecast ?? 'Weather condition'}
                      >
                        {emoji}
                      </span>
                      <span className={classes.timeLabel}>{formatHour(period.startTime)}</span>
                    </Table.Td>
                    <Table.Td className={classes.conditionCellWrapper}>
                      <div className={classes.conditionCell}>
                        <Text size="sm" className={classes.conditionLabel}>
                          {period.shortForecast ?? '—'}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td className={classes.numericCell}>
                      {period.probabilityOfPrecipitation?.value != null
                        ? `${period.probabilityOfPrecipitation.value}%`
                        : ''}
                    </Table.Td>
                    <Table.Td className={classes.numericCell}>
                      {period.temperature != null
                        ? `${period.temperature}${period.temperatureUnit}`
                        : ''}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Card>
      ))}
    </>
  );
};
