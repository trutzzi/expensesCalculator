import { Typography, Grid, Button } from "@mui/material";
import PieComponent from "../components/Pie";
import Transactions from "../components/Transaction";
import { GrupedAndProcessed } from "../types";


export default function Index({ grupedByMerchant, tags, dataCompare, autoTagging, handleAddTagToMerchant }: any) {
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
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={4} md={4}>
        {dataCompare && <PieComponent dataCompare={dataCompare} />}
      </Grid>
      <Grid item xs={12} lg={8} md={8}>
        {/* <MerchantsTable /> */}
        {<Button variant='contained' onClick={() => autoTagging()}>Apply filters</Button>}
        {renderMerchant()}
      </Grid>
    </Grid>
  )
}