import React,{useState,useEffect} from 'react';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import {getQuestions} from '../net/index'
import Typography from '@mui/joy/Typography';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import {fetchAccessToken} from '../net/http'
import { Fade } from '@mui/material';
import Divider from '@mui/joy/Divider';

interface UrlContent{
    url:string,
    questions:Array<string>
}
function Homepage(){
    const [pageState,setPageState] = useState<number>(0);
    const [pageContent,setPageContent] = useState<UrlContent>({url:"",questions:[]});
    const onSubmitClicked = async () => {
      setPageState(1);
      try {
        const resp = await getQuestions(pageContent.url);
        pageContent.questions = resp.data;
        if(pageContent.questions.length !=0){
          setPageState(2);
        }else{
          alert("Incorrect result from AI api ")
          setPageState(0);
        }
      } catch (error) {
        alert("Network error")
      }

    }
    useEffect(()=>{
      fetchAccessToken()
      return ()=>{
      };
    },[])
    return (<Box
      component="main"
      sx={{
        my: 3,
        margin: 'auto',
        justifyContent: 'center',
        mx: 3,}}>
      <Box
      sx={(theme) => ({
        height: 50
        })}> </Box>
    {pageState==0 || pageState==1?(
      <Fade in={pageState==0|| pageState==1} timeout={3000} appear={pageState==0}>
    <Box
        component="main"
        sx={{
          my: 'auto',
          margin: 'auto',
          justifyContent: 'center',
          mx: 'auto',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: 'sm',
          '& form': {
            display: 'flex',
            flexDirection: 'column',
          },
          [`& .${formLabelClasses.asterisk}`]: {
            visibility: 'hidden',
          },
        }}
      >
      <Typography
        level="h3"
        fontWeight="m"
        // fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
      Interactive Content Quiz Generator
      </Typography>
      <Box
      sx={(theme) => ({
        height: 50
        })}> </Box>
        <Grid container spacing={2} sx={{ flexGrow: 1,alignItems: 'center',justifyContent: 'center',margin: 'auto',}}>
        <Grid xs={2} />
        <Grid xs={6} >
        <Input placeholder="Enter a website url to generate questions"
        onChange={(e)=>{pageContent.url = e.target.value}}></Input>
        </Grid>
        <Grid xs={2} sx={{ alignItems: 'center',justifyContent: 'center',margin: 'auto',}}>
        {pageState == 0?(<Button onClick={onSubmitClicked}>Generate</Button>):
        <Button loading>Loading</Button>}
        </Grid>
        <Grid xs={2} />
        </Grid>


    </Box></Fade>):(<div/>)}
    {pageState>1?(
      <Fade in={pageState>1} timeout={3000} appear={pageState==2}>
    <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center',
          flexShrink: 999,
          [theme.breakpoints.up(834)]: {
            minWidth: 420,
            alignItems: 'center',
            textAlign: 'center',
          },
          space:10,
          mx:2,
          my:3,
          // [`& .${typographyClasses.root}`]: {
          //   textWrap: 'balance',
          // },
        })}
      >
      <Typography
        level="body-lg"
        fontWeight="m"
        // fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
      Which product or service category are you interested in?
      </Typography>
      <Box
      sx={(theme) => ({
        height: 30
        })}> </Box>
      <RadioGroup
        aria-labelledby="question-label"
        defaultValue="Empty choice"
        size="lg"
        sx={{ gap: 1.5 }}
        orientation="horizontal"
      >
        {pageContent.questions.map((value,index) => (
          <Sheet key={value} sx={{ p: 2, borderRadius: 'md', boxShadow: 'sm' }}>
            <Radio
              label={`${value}`}
              overlay
              disableIcon
              value={value}
              slotProps={{
                label: ({ checked }) => ({
                  sx: {
                    fontWeight: 'lg',
                    fontSize: 'md',
                    color: checked ? 'text.primary' : 'text.secondary',
                  },
                }),
                action: ({ checked }) => ({                  
                  sx: (theme) => ({
                    ...(checked && {
                      '--variant-borderWidth': '2px',
                      '&&': {
                        // && to increase the specificity to win the base :hover styles
                        borderColor: theme.vars.palette.primary[500],
                      },
                    }),
                  }),
                }),
              }}
              onChange={()=>{setPageState(3);}}
            />
          </Sheet>
        ))}
      </RadioGroup>
      <Box
      sx={(theme) => ({
        height: 30
        })}> </Box>
      <Button disabled={pageState==2} size="lg" onClick={()=>{alert("Success!");setPageState(0)}}>Submit your answer</Button>
      </Box></Fade>):<div/>}
    </Box>);
}
export default Homepage