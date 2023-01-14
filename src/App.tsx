import { useEffect, useState } from 'react';
import './App.css';
import { read, utils } from 'xlsx';
import { Box, Container, CssBaseline, Grid, Stack, TextField, Typography } from '@mui/material';

import Button from '@mui/material/Button';
import { CSVFormat, GrupedAndProcessed, GrupedByMerchant } from './types';
import PieComponent from './Pie';
import FileImport from './components/FileImport';
import Transactions from './components/Transaction';
import Header from './Header';
import DefaultTags from './DefaultTags';

function App() {
  const [dataCsv, setDataCsv] = useState<CSVFormat[]>([]);
  const [grupedData, setGrupedData] = useState<GrupedAndProcessed[]>([])
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(DefaultTags);

  const [grupedByMerchant, setGrupByMercahng] = useState<GrupedByMerchant>({})
  const [grupedByTags, setGrupByTags] = useState<any>([])
  const [dataCompare, setDataCompare] = useState<any>([]);
  const [DataForPie, setDataForPie] = useState<any>(null)

  useEffect(() => {

    let groupedValues: GrupedAndProcessed[] = [];

    for (let i = 0; i < dataCsv.length; i++) {
      let constructObj = { id: 0, dataCumparare: '', tip: '', valoare: '0', terminal: '' };

      // Check type
      if (dataCsv[i]?.B && dataCsv[i]?.H && dataCsv[i]?.Q) {
        constructObj = {
          id: i,
          dataCumparare: dataCsv[i].B || '',
          tip: dataCsv[i].H || '',
          valoare: dataCsv[i].Q || '',
          terminal: dataCsv[i + 2].H || ''
        }

        groupedValues.push(constructObj);
      }
      setGrupedData(groupedValues);

    }

  }, [dataCsv]);

  useEffect(() => {

    if (grupedData) {
      let grupedDataArray: GrupedByMerchant = {};
      grupedData.forEach((row: GrupedAndProcessed, index: number) => {
        if (grupedDataArray[row.terminal]) {
          let newRows = grupedDataArray[row.terminal].rows;
          grupedDataArray = { ...grupedDataArray, [row.terminal]: { rows: [...newRows, row], id: index, tag: ['General'], total: 0 } }
        } else {
          grupedDataArray = { ...grupedDataArray, [row.terminal]: { rows: [row], id: index, tag: ['General'], total: 0 } }
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
        if (grupedByMerchant[merchant].tag.indexOf(tag.name) !== -1) {
          grupByLabesl.push(grupedByMerchant[merchant]);
        }
      }
    })
    setGrupByTags(grupByLabesl)
  }, [grupedByMerchant, tags])

  const handleAddTag = () => {
    if (newTag.trim().length >= 3) {
      if (tags.find(item => item.name === newTag)) {
        setTags([...tags, { name: newTag, filters: [] }]);
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
          setDataCsv(rows)
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }

  const renderMerchant = () => {
    let renderTransactions = [];
    let totalExpenses = 0;
    for (let merchant in grupedByMerchant) {
      // eslint-disable-next-line no-loop-func
      grupedByMerchant[merchant].rows.forEach((item: GrupedAndProcessed) => {
        totalExpenses = totalExpenses += parseFloat(item.valoare)
      });

      let propsData = {
        id: grupedByMerchant[merchant].id,
        title: grupedByMerchant[merchant].rows[0].terminal.replace('Terminal: ', ''),
        total: grupedByMerchant[merchant].total || 0,
        transactions: grupedByMerchant[merchant].rows.length
      }

      renderTransactions.push(<Transactions tags={tags} merchant={grupedByMerchant[merchant]} data={propsData} handleAddTagToMerchant={handleAddTagToMerchant} />)
    }
    return <>
      {Object.keys(grupedByMerchant).length > 0 && <Typography variant='h5'>Expenses <span style={{ color: 'green' }}>{totalExpenses}</span> RON</Typography>}
      {renderTransactions}
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

  const grupForCharts = () => {
    let grupByTag: {
      tag: string,
      total: number
    }[] = [];

    tags.forEach(({ name }) => {
      grupByTag.push({
        tag: name,
        total: 0
      });
    });

    tags.forEach(tag => {

      grupedByTags.forEach((merchant: any) => {

        if (merchant.tag.indexOf(tag.name) !== -1) {
          grupByTag.forEach((item: any) => {
            if (item.tag.indexOf(tag.name) !== -1) {
              item.total += merchant.total
            }
          })
        }
      })
    })
    setDataCompare(grupByTag);
  }

  const autoTagging = () => {
    
    let newGrupedByTags = [...grupedByTags];

    newGrupedByTags.forEach((merchant: any) => {
      tags.forEach(tag => {
        if (merchant.rows[0].terminal.search(tag) !== -1) {
          tag.filters.forEach(tagSearch => {
            // Find a way to search with regex for matching the whole world 
            if (merchant.rows[0].terminal.toLocaleUpperCase().search(tagSearch.toLocaleUpperCase()) !== -1) {
              //Remove general tag from array when autosort
              let fromArray = merchant.tag.indexOf('General')
              merchant.tag.splice(fromArray, fromArray + 1)
              merchant.tag.push(tag.name)
            }
          })
        }
      })
    })
    setGrupByTags(newGrupedByTags)
  }

  useEffect(() => {
    grupForCharts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupedByTags])

  useEffect(() => {
  }, [dataCsv])

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
      <Container style={{ marginTop: 100 }} >
        <Stack spacing={2}>
          <Header >
            <Grid style={{ justifyContent: 'center' }} container spacing={2}>
              <Grid item xs={8}>
                <TextField variant='standard' fullWidth placeholder=" You can write multiple tags and  separate them by ',' " onChange={e => setNewTag(e.target.value)} />
              </Grid>
              <Grid item xs={2}>
                <Button fullWidth variant='text' color='inherit' onClick={handleAddTag}>New Tag</Button>
              </Grid>
              <Grid item xs={2}>
                <FileImport onChange={handleImport} />
              </Grid>
            </Grid>
          </Header>
          {dataCsv.length ? <Button variant='contained' onClick={() => autoTagging()}>Autosort</Button> : ''}
          <Typography variant='h4'>What is this?</Typography>
          <Typography variant='body2'>This is a simple p**rogram to process and tag your expenses. Download your .xls file from the bank and upload it here.
          </Typography>
          <ol>
            <li>Create tags (You can put them in series: <small>test1, test2, test3</small> for bulk creating)</li>
            <li>Attach tags to transactions </li>
            <li>See where you spend your money on the chart</li>
          </ol>
          <Typography variant='caption'>This app doesn't store any information about your transactions or any legal information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              {renderMerchant()}
            </Grid>
            <Grid item xs={4}>
              {DataForPie && <PieComponent data={DataForPie} />}
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box >
  );
}

export default App;