import { Card, Pill, Table, Text, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { formatHour } from '../../../../lib/time/formatHour';
import { getDayPhase } from '../../../../lib/time/getDayPhase';
import { getDayPhase } from '../../../../lib/time/getDayPhase';
import { filterActivePeriods } from '../../../../lib/weather/filterActivePeriods';
import { getWeatherEmoji } from '../../../../lib/weather/getWeatherEmoji';
import { groupHourlyPeriodsByDay } from '../../../../lib/weather/groupHourlyPeriods';
import { Period } from '../../../../types/weather';
import classes from './HourlyTables.module.css';

interface HourlyTablesProps {
  periods?: Period[];
  maxHours?: number;
}

export const HourlyTables = ({ periods, maxHours = 48 }: HourlyTablesProps) => {
  const now = new Date();
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const activePeriods = filterActivePeriods(periods ?? [], now);

  const baseCutoffMs = now.getTime() + maxHours * 60 * 60 * 1000;
  const cutoffDate = new Date(baseCutoffMs);
  cutoffDate.setHours(23, 59, 59, 999);
  const cutoffMs = cutoffDate.getTime();

  const windowedPeriods = activePeriods.filter((period) => {
    const start = new Date(period.startTime).getTime();
    return start <= cutoffMs;
  });

  if (!windowedPeriods.length) {
    return null;
  }

  const grouped = groupHourlyPeriodsByDay(windowedPeriods, maxHours, now);

  const dayExtremes = new Map<string, { high: number; low: number; unit: string | null }>();

  grouped.forEach(({ label, periods: groupedPeriods }) => {
    if (label === 'Today') {
      return;
    }

    const temps = groupedPeriods
      .map((period) => period.temperature)
      .filter((value): value is number => typeof value === 'number');

    const unit = groupedPeriods.find((period) => period.temperatureUnit)?.temperatureUnit ?? null;

    const timestamps = groupedPeriods
      .map((period) => new Date(period.startTime).getTime())
      .filter((value) => !Number.isNaN(value))
      .sort((a, b) => a - b);

    const hasFullDayCoverage =
      timestamps.length >= 24 &&
      timestamps[timestamps.length - 1] - timestamps[0] >= 23 * 60 * 60 * 1000;

    if (!temps.length || !hasFullDayCoverage) {
      return;
    }

    dayExtremes.set(label, {
      high: Math.max(...temps),
      low: Math.min(...temps),
      unit,
    });
  });

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
              {label !== 'Today' && dayExtremes.has(label) ? (
                <Text
                  component="span"
                  size="sm"
                  fw={600}
                  ml="sm"
                  c={colorScheme === 'dark' ? theme.colors.sky[1] : theme.colors.dark[6]}
                >
                  {(() => {
                    const extremes = dayExtremes.get(label)!;
                    const unit = extremes.unit ?? '';
                    return `↑ High ${extremes.high}${unit} • ↓ Low ${extremes.low}${unit}`;
                  })()}
                </Text>
              ) : null}
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
                      <span className={classes.timeLabel}>
                        {formatHour(period.startTime)}
                        {(() => {
                          const phase = getDayPhase(period.startTime);
                          if (!phase) {
                            return null;
                          }
                          const pillColor = phase === 'Day' ? 'sunshine' : 'sky';
                          const pillTone = phase === 'Day' ? 5 : 6;
                          const pillBg = `var(--mantine-color-${pillColor}-${pillTone})`;
                          const pillText = phase === 'Day' ? '#7a4a00' : '#0b2a3a';
                          return (
                            <Pill
                              size="xs"
                              ml={6}
                              radius="md"
                              style={{
                                backgroundColor: pillBg,
                                color: pillText,
                                fontWeight: 700,
                                lineHeight: 1.1,
                                border: '1px solid rgba(0,0,0,0.06)',
                              }}
                            >
                              {phase}
                            </Pill>
                          );
                        })()}
                      </span>
                      <span className={classes.timeLabel}>
                        {formatHour(period.startTime)}
                        {(() => {
                          const phase = getDayPhase(period.startTime);
                          if (!phase) {
                            return null;
                          }
                          const pillColor = phase === 'Day' ? 'sunshine' : 'sky';
                          const pillTone = phase === 'Day' ? 5 : 6;
                          const pillBg = `var(--mantine-color-${pillColor}-${pillTone})`;
                          const pillText = phase === 'Day' ? '#7a4a00' : '#0b2a3a';
                          return (
                            <Pill
                              size="xs"
                              ml={6}
                              radius="md"
                              style={{
                                backgroundColor: pillBg,
                                color: pillText,
                                fontWeight: 700,
                                lineHeight: 1.1,
                                border: '1px solid rgba(0,0,0,0.06)',
                              }}
                            >
                              {phase}
                            </Pill>
                          );
                        })()}
                      </span>
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
