import { Box } from '@mantine/core';
import useStyles from './PreviewLines.styles';

export const PreviewLines = ({ numberOfSplits }: { numberOfSplits: number }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.previewLinesContainer}>
      {[...Array(numberOfSplits - 1)].map((e, i) => (
        <Box key={i} className={classes.previewLine} />
      ))}
    </Box>
  );
};
