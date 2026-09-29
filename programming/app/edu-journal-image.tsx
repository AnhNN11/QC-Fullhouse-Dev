import Image from 'next/image';
import { journalImageDescriptions } from '@/lib/edu-journal-media';
import './edu-journal-image.css';

export default function JournalImage({ image, sizes }: { image: string; sizes: string }) {
  return <Image src={`/brand/company/${image}`} alt={journalImageDescriptions[image] ?? 'Hình ảnh do đội ngũ DolphinX cung cấp'}
    width={1536} height={1024} sizes={sizes}/>;
}
