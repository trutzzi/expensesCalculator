import { createContext, useEffect, useMemo, useState } from 'react';
import './App.css';
import { Box, Container, CssBaseline, Stack, ThemeProvider } from '@mui/material';

import { CSVFormat, GrupedAndProcessed, GrupedByMerchant, PieData } from './types';
import Header from './components/Header';
import DefaultTags from './DefaultTags';
// import FileUpload from './components/UploadRaport';
import { Route, Routes } from 'react-router-dom';
import NewTag from './pages/NewTag';
import { read, utils } from 'xlsx';
import FileImport from './components/FileImport';
import Info from './pages/info';
import { CreateTheme, SwitchTheme } from './Theme';
import ErrorBoundary from './components/ErrorBoundary';
import { routes } from './routes';
import Index from './pages/Index';
const ColorModeContext = createContext({ toggleColorMode: () => { } });

function App() {
  const [dataCsv, setDataCsv] = useState<CSVFormat[]>([]);
  const [grupedData, setGrupedData] = useState<GrupedAndProcessed[]>([])
  const [tags, setTags] = useState(DefaultTags);

  const [grupedByMerchant, setGrupByMercahng] = useState<GrupedByMerchant>({})
  const [grupedByTags, setGrupByTags] = useState<any>([])
  const [dataCompare, setDataCompare] = useState<any>([]);
  const [mode, setMode] = useState(localStorage.getItem('theme') as 'dark' | 'light' ?? 'light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prevMode) => {
          const mode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme', mode)
          return mode
        })
    }),
    [],
  );
  const theme = useMemo(
    () =>
      CreateTheme(mode),
    [mode],
  );


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

  const handleAddTag = (newTag: { name: string, filters: string[] }) => {
    setTags([...tags, newTag])
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
    let grupByTag: PieData[] = [];

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


  // const handleUpload = async (file: any) => {
  //   // Create a new FormData object to send the file
  //   const data = new FormData();
  //   data.append('file', file);

  //   // Send the file to the server
  //   try {
  //     const response = await fetch('//localhost:3000/upload', {
  //       method: 'POST',
  //       body: data,
  //     });
  //     if (response.status === 200) {
  //       setDataCsv(await response.json())
  //     }
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  useEffect(() => {
    grupForCharts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupedByTags])

  return (
    <ErrorBoundary>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Box sx={{ width: '100%' }}>
            <CssBaseline />
            <Container style={{ marginTop: 100 }} >
              <Stack spacing={2}>
                <Header >
                  <FileImport onChange={handleImport} />
                  <SwitchTheme currentMode={theme.palette.mode} onThemeChange={colorMode.toggleColorMode} />
                  {/* This is v1 beta with nodejs server */}
                  {/* <FileUpload onFileUpload={handleUpload} /> */}
                </Header>
                <Routes>
                  <Route path={routes.index} element={<Index grupedByMerchant={grupedByMerchant} tags={tags} dataCompare={dataCompare} autoTagging={autoTagging} handleAddTagToMerchant={handleAddTagToMerchant} />} />
                  <Route path={routes.filters} element={<NewTag tags={tags} handleAddTag={handleAddTag} />} />
                  <Route path={routes.info} element={<Info />} />
                </Routes>
              </Stack>
            </Container>
          </Box >
        </ThemeProvider>
      </ColorModeContext.Provider>
    </ErrorBoundary>
  );
}

export default App;