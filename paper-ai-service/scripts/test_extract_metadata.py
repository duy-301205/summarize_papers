import fitz

from app.data.extract.metadata_extractor import MetadataExtractor


PDF_PATH = "storage/raw_pdfs/EAB_0003.pdf"


def extract_metadata(pdf_path: str):

    doc = fitz.open(pdf_path)

    metadata = MetadataExtractor.extract(doc)

    doc.close()

    return metadata


if __name__ == "__main__":

    metadata = extract_metadata(PDF_PATH)

    print("\n====================")
    print("EXTRACT RESULT")
    print("====================\n")

    for key, value in metadata.items():

        print(f"{key}:")
        print(value)
        print("-" * 50)