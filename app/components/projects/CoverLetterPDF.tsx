"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.registerHyphenationCallback((word) => [word]);

type CoverLetterProps = {
  name: string;
  email: string;
  phoneNumber: string;
  coverLetter: string;
  greeting: string;
  signOff: string;
};

const CoverLetterPDF = ({ name, email, phoneNumber, coverLetter, greeting, signOff }: CoverLetterProps) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.headerDetails}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subTitle}>{email}</Text>
            <Text style={styles.subTitle}>{phoneNumber}</Text>
          </View>
          <View style={styles.headerLine} />
        </View>
        <View style={styles.content}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.paragraph}>{coverLetter}</Text>
          <Text style={styles.closing}>
            {signOff}
            {"\n"}
            {name}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    paddingVertical: 40,
    paddingHorizontal: 50,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#FAFAFA",
  },
  headerContainer: {
    marginBottom: 25,
  },
  headerDetails: {
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  subTitle: {
    fontSize: 12,
    color: "#555",
  },
  headerLine: {
    height: 2,
    backgroundColor: "#0c4a6e",
    marginTop: 8,
    marginHorizontal: 0,
  },
  content: {
    marginTop: 10,
  },
  greeting: {
    fontSize: 12,
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 14,
    lineHeight: 1.6,
    textAlign: "left",
    fontSize: 12,
    color: "#333",
  },
  closing: {
    marginTop: 10,
    lineHeight: 1.6,
    fontSize: 12,
    color: "#333",
  },
});

export default CoverLetterPDF;
