import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PercentIcon } from 'lucide-react';
import React, { useState } from 'react'

export default function DialogAdditionalDetails({
    open = false,
    handleSubmit = () => { },
    handleChangeOpen = () => { }
}) {
    const [data, setData] = useState({
        riqueza: '',
        tasa: ''
    });

    const handleChange = (e) => { 
        setData({
            ...data,
            [e.target.name] : e.target.value
        })
    }
  return (
      <Dialog
          open={open}
            onOpenChange={handleChangeOpen}
        >
          <DialogContent>
              <DialogHeader>
                  <h1>Ingresa datos restantes</h1>
              </DialogHeader>
              <div className='w-full flex flex-col gap-4 mt-4'>
                  <div>
                      <label htmlFor='riqueza'>Ingresa la Riqueza Inicial : </label>
                      <div className='flex flex-row items-center gap-2'>
                            <p>S/.</p>
                            <Input
                                variant="ghost"
                                name="riqueza"
                                type="number"
                                onChange={handleChange}
                                value={data.riqueza}
                            />
                      </div>
                  </div>
                  <div>
                      <label htmlFor='tasa'>Ingresa la Tasa de Interés (% anual) : </label>
                      <div className='flex flex-row items-center gap-2'>
                          <p>
                              <PercentIcon fontSize={'small'}/> 
                          </p>
                          <Input
                                name="tasa"
                                variant="ghost"
                                type="number"
                                onChange={handleChange}
                                className={'border p-2 rounded-lg w-full'}
                                value={data.tasa}
                          />
                      </div>
                  </div>
                    <button
                        type='button'
                        className='bg-nigth-blue hover:bg-indigo-950 text-white p-2 rounded-lg mt-4 w-full'
                      onClick={() =>  handleSubmit(data)}
                    >
                      Guardar datos
                    </button>
              </div>
          </DialogContent>
    </Dialog>
  )
};
