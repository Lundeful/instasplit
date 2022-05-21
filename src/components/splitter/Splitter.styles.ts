import { createStyles } from '@mantine/core';

const useStyles = createStyles(theme => ({
  container: {
    marginTop: 50,
  },
  previewLinesContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  previewLine: {
    width: 0,
    height: '100%',
    borderRightWidth: 1,
    borderRightStyle: 'dashed',
    borderRightColor: '#fff',
  },
}));

export default useStyles;
