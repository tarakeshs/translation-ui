import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Backdrop,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import logo from "../assets/logo.png";

// Define light theme
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

// Language options
const languageOptions = [
  { value: "hi", label: "Hindi" },
  { value: "kn", label: "Kannada" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "bn", label: "Bengali" },
  { value: "ml", label: "Malayalam" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "pa", label: "Punjabi" },
  { value: "or", label: "Odia" },
  { value: "as", label: "Assamese" },
  { value: "ur", label: "Urdu" },
  { value: "sd", label: "Sindhi" },
  { value: "sa", label: "Sanskrit" },
  { value: "ks", label: "Kashmiri" },
  { value: "doi", label: "Dogri" },
  { value: "sat", label: "Santali" },
  { value: "mni", label: "Meitei (Manipuri)" },
  { value: "kok", label: "Konkani" },
  { value: "brx", label: "Bodo" },
];

const TranslateApp: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>("");
  const [targetLanguage, setTargetLanguage] = useState<string>("hi");
  const [loading, setLoading] = useState<boolean>(false);
  const [translations, setTranslations] = useState<
    {
      original: string;
      preprocessed: string;
      translated: string;
      language: string;
    }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTranslate = async () => {
    if (sourceText.trim() === "") return;
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/translate", {
        text: sourceText,
        target_language: targetLanguage,
        model: "google",
      });
      const newTranslation = {
        original: response.data.original_text,
        preprocessed: response.data.preprocessed_text,
        translated: response.data.translated_text,
        language:
          languageOptions.find((lang) => lang.value === targetLanguage)
            ?.label || targetLanguage,
      };
      setTranslations((prevTranslations) => [
        newTranslation,
        ...prevTranslations,
      ]);
      setSourceText("");
    } catch (error) {
      console.error("Error translating text:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setSourceText(fileContent);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setSourceText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <AppBar position="fixed" style={{ background: "#fff", color: "#3d4b64" }}>
        <Toolbar>
          <img
            src={logo}
            alt="Logo"
            style={{ width: 60, height: 40, marginRight: 10 }}
          />
          <Typography variant="h6">NLP Applications Assignment 2</Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          height: "87vh",
        }}
        style={{ marginTop: "100px" }}
      >
        <Grid container spacing={3} sx={{ flexGrow: 1, height: "100%" }}>
          {/* Left Panel */}
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#f5f5f5", mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Task A: Problem Statement</Typography>
                <Typography variant="body1" paragraph>
                  Develop a simple application that can translate user-provided
                  text from English to an Indic language (e.g., Hindi). The
                  application should utilize machine translation techniques to
                  achieve accurate translation.
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: "#f5f5f5", mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Web Interface: (4 Marks)</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>User Interface:</strong> Create an intuitive
                      interface where users can input text or upload text files
                      for translation.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Translation Display:</strong> Visualize the
                      translated text clearly and understandably, using
                      appropriate formatting.
                    </Typography>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <Typography variant="h6">
                  Translation Mechanism: (4 Marks)
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Translation Model Integration:</strong> Implement
                      a machine translation model capable of translating between
                      English and the selected Indic language.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Text Preprocessing:</strong> Apply necessary
                      preprocessing steps (e.g., normalization, tokenization) to
                      prepare the text for translation.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Translation Output:</strong> Ensure the model
                      provides accurate and contextually appropriate
                      translations.
                    </Typography>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Grid>

          {/* Right panel - Translation Section */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Box
              sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2 }}
            >
              <Typography variant="h6">Enter Text to Translate</Typography>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    label="Enter text to translate"
                    multiline
                    rows={3}
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    sx={{ my: 2 }}
                  />
                  <label htmlFor="file-upload">
                    <input
                      type="file"
                      accept=".txt"
                      id="file-upload"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      sx={{ mt: 2, mr: 2 }}
                    >
                      Upload File
                    </Button>
                  </label>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClear}
                    sx={{ mt: 2 }}
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <div style={{ position: "relative", top: "20px" }}>
                    <Autocomplete
                      options={languageOptions}
                      getOptionLabel={(option) => option.label}
                      value={languageOptions.find(
                        (option) => option.value === targetLanguage
                      )}
                      onChange={(event, newValue) => {
                        setTargetLanguage(newValue?.value || "hi");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select destination language"
                          variant="outlined"
                        />
                      )}
                    />
                    <Button
                      variant="contained"
                      onClick={handleTranslate}
                      disabled={loading || sourceText === ""}
                      sx={{ mt: 2, width: "100%" }}
                    >
                      {loading ? "Translating..." : "Translate"}
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Translation History:
              </Typography>
              {translations.length === 0 && (
                <Typography variant="body1" color="textSecondary">
                  No translations yet.
                </Typography>
              )}
              {translations.map((translation, index) => (
                <Card
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0f7fa",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    {`Original: ${translation.original}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`Preprocessed: ${translation.preprocessed}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`Translated (${translation.language}): ${translation.translated}`}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </ThemeProvider>
  );
};

export default TranslateApp;
