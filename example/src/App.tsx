// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from 'react';
import Queue from '@thevsstech/queue';

const queue = Queue();

export default function App() {
  useEffect(() => {
    const data = async () => {
      await queue.createJob(
        'test',
        { id: 1 },
        { attempts: 1, timeout: 5000, priority: 100 }
      );

      await queue.createJob(
        'test',
        { id: 1 },
        { attempts: 1, timeout: 5000, priority: 90 }
      );

      queue.addWorker(
        'test',
        (id, payload) => {
          console.log(id, payload);
        },
        {
          concurrency: 5,
        }
      );

      await queue.start(20000);
    };

    data();
  }, []);

  return null;
}
