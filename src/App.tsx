import { useEffect, useState } from 'react';
import './App.css';
import { read, utils } from 'xlsx';
import { Box, Card, CardActions, CardContent, Container, CssBaseline, Grid, Input, Stack, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';

import Button from '@mui/material/Button';
import { CSVFormat, GrupedAndProcessed, GrupedByMerchant } from './types';
import PieComponent from './Pie';

function App() {
  const [daat, setData] = useState<CSVFormat[]>([]);
  const [grupedData, setGrupedData] = useState<GrupedAndProcessed[]>([])
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(['altele']);

  const [grupedByMerchant, setGrupByMercahng] = useState<GrupedByMerchant>({})
  const [grupedByTags, setGrupByTags] = useState<any>([])
  const [dataCompare, setDataCompare] = useState<any>([]);
  const [DataForPie, setDataForPie] = useState<any>(null)

  useEffect(() => {

    let groupedValues: GrupedAndProcessed[] = [];

    for (let i = 0; i < daat.length; i++) {
      let constructObj = { id: 0, dataCumparare: '', tip: '', valoare: '0', terminal: '' };

      // Check type
      if (daat[i]?.B && daat[i]?.H && daat[i]?.Q) {
        constructObj = {
          id: i,
          dataCumparare: daat[i].B || '',
          tip: daat[i].H || '',
          valoare: daat[i].Q || '',
          terminal: daat[i + 2].H || ''
        }

        groupedValues.push(constructObj);
      }
      setGrupedData(groupedValues);

    }

  }, [daat]);

  useEffect(() => {

    if (grupedData) {
      let grupedDataArray: GrupedByMerchant = {};
      grupedData.forEach((row: GrupedAndProcessed, index: number) => {
        if (grupedDataArray[row.terminal]) {
          let newRows = grupedDataArray[row.terminal].rows;
          grupedDataArray = { ...grupedDataArray, [row.terminal]: { rows: [...newRows, row], id: index, tag: ['altele'], total: 0 } }
        } else {
          grupedDataArray = { ...grupedDataArray, [row.terminal]: { rows: [row], id: index, tag: ['altele'], total: 0 } }
        }

        //Make total if rows was created and sorted
        if (grupedDataArray[row.terminal].rows) {
          let total = grupedDataArray[row.terminal].rows.reduce(
            (acumulator, currentValue) => {
              return acumulator + parseFloat(currentValue.valoare);
            }, 0)
          grupedDataArray[row.terminal].total = total
        }
      })
      setGrupByMercahng(grupedDataArray)
    }

  }, [grupedData])

  useEffect(() => {
    let grupByLabesl: any = [];
    tags.forEach(tag => {
      for (let merchant in grupedByMerchant) {
        if (grupedByMerchant[merchant].tag.indexOf(tag) !== -1) {
          grupByLabesl.push(grupedByMerchant[merchant]);
        }
      }
    })
    setGrupByTags(grupByLabesl)
    // setGrupByLabels()
  }, [grupedByMerchant, tags])

  const handleAddTag = () => {
    if (newTag.trim().length >= 3) {
      if (tags.indexOf(newTag) === -1) {
        setTags([...tags, newTag]);
      } else {
        alert('Un TAG cu acelasi nume a fost deja salvat.')
      }
    } else {
      alert('Numele tagului tb sa contina minim 3 litere.')
    }
  }

  const handleImport = (event: any) => {
    const files = event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event?.target?.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], { header: 'A' }) as CSVFormat[];
          setData(rows)
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }

  const renderMerchant = () => {
    let comp = [];
    let totalExpenses = 0;
    for (let merchant in grupedByMerchant) {
      // eslint-disable-next-line no-loop-func
      grupedByMerchant[merchant].rows.forEach((item: GrupedAndProcessed) => {
        totalExpenses = totalExpenses += parseFloat(item.valoare)
      });
      comp.push(
        <Card key={'card__' + grupedByMerchant[merchant].id} variant="elevation" style={{ padding: 10 }}>
          <CardContent>
            <Stack>
              <Typography variant='subtitle2'>This is a beta version</Typography>
              <Typography variant='h6'>
                {grupedByMerchant[merchant].rows[0].terminal.replace('Terminal: ', '')}
              </Typography>
              <Typography variant='subtitle1' color={'green'}>{grupedByMerchant[merchant].total} RON</Typography>
              <Typography variant='overline'>{grupedByMerchant[merchant].rows.length} Tranzactii  </Typography>
            </Stack>
          </CardContent>
          <CardActions>
            <Grid>
              {renderAddTags(grupedByMerchant[merchant].id, grupedByMerchant[merchant].tag)}
            </Grid>
          </CardActions>
        </Card >
      )
    }
    return <>
      {Object.keys(grupedByMerchant).length > 0 && <Typography variant='h4'>Total Cheltueli <span style={{ color: 'green' }}>{totalExpenses}</span> RON</Typography>}
      {comp}
    </>
  };

  const handleAddTagToMerchant = (id: number, tag: string) => {
    for (let merchant in grupedByMerchant) {
      let copyOfMerchantGroup = { ...grupedByMerchant }
      if (grupedByMerchant[merchant].id === id) {
        if (grupedByMerchant[merchant].tag.indexOf(tag) === -1) {
          copyOfMerchantGroup[merchant].tag = [...grupedByMerchant[merchant].tag, tag];
        } else {
          let deleteFromPos = grupedByMerchant[merchant].tag.indexOf(tag)
          copyOfMerchantGroup[merchant].tag.splice(deleteFromPos, deleteFromPos + 1)
        }
      }
      setGrupByMercahng(copyOfMerchantGroup)
    }
  }

  const renderAddTags = (id: number, selectedTags: string[]) => {
    return tags.map((tag: string, index: number) => {
      const isActive = selectedTags.indexOf(tag) === -1;
      return <Chip
        key={'chip__' + index}
        style={{ marginRight: 5, marginBottom: 10 }}
        color={isActive ? undefined : 'primary'}
        onClick={() => handleAddTagToMerchant(id, tag)}
        disabled={!!selectedTags.length && isActive}
        variant={isActive ? 'outlined' : 'filled'}
        label={tag}
      />
    })
  };
  const calculateTotalPerTag = () => {
    let grupByTag: any = [];

    tags.forEach(tag => {
      grupByTag.push({
        tag,
        total: 0
      });
    });

    tags.forEach(tag => {

      grupedByTags.forEach((merchant: any) => {

        if (merchant.tag.indexOf(tag) !== -1) {
          grupByTag.forEach((item: any) => {
            if (item.tag.indexOf(tag) !== -1) {
              item.total += merchant.total
            }
          })
        }
      })
    })
    console.log('final', grupByTag)
    setDataCompare(grupByTag);
  }

  useEffect(() => {
    calculateTotalPerTag()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupedByTags])

  useEffect(() => {
    setDataForPie({
      labels: dataCompare.map((item: any) => item.tag),
      datasets: [
        {
          label: 'RON',
          data: dataCompare.map((item: any) => item.total),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    })
  }, [dataCompare])


  return (
    <Box sx={{ width: '100%' }}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Input style={{ width: '100%' }} placeholder="Adauga o eticheta ..." onChange={e => setNewTag(e.target.value)} />
            </Grid>
            <Grid item xs={2}>
              <Button variant='contained' onClick={handleAddTag}>Add</Button>
            </Grid>
          </Grid>
          <Button variant="contained" component="label">
            Select file
            <input hidden accept="xls/*" multiple type="file" onChange={handleImport} />
          </Button>
          {renderMerchant()}
        </Stack>
        {DataForPie && <PieComponent data={DataForPie} />}
      </Container>
    </Box >
  );
}

export default App;


/**
 * TODO: 
 * 1. Realizarea unui chart pentru expenses per merchant
 * 2. Redesign la applicatie
 * 3. De verificat totalul - nu se calculeaza bine
 * 4. De gasit o solutie sa scada automat contul de economii 
 */