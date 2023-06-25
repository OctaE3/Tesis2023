package com.chacineria.marcelina.controlador;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.chacineria.marcelina.entidad.persona.Cliente;
import com.chacineria.marcelina.entidad.persona.Localidad;
import com.chacineria.marcelina.entidad.persona.Proveedor;
import com.chacineria.marcelina.entidad.persona.Usuario;
import com.chacineria.marcelina.repositorio.persona.UsuarioRepositorio;
import com.chacineria.marcelina.servicio.persona.ClienteServicioImpl;
import com.chacineria.marcelina.servicio.persona.LocalidadServicioImpl;
import com.chacineria.marcelina.servicio.persona.ProveedorServicioImpl;
import com.chacineria.marcelina.servicio.persona.UsuarioServicioImpl;

@Controller
@RequestMapping("/marcelina")
@RestController
public class Controladora_Persona {
    
    //#region ABM Cliente

    @Autowired
    private ClienteServicioImpl clienteServicioImpl;

    @GetMapping("/listar-clientes")
    public List<Cliente> listadoCliente(){
        List<Cliente> clientes = StreamSupport
        .stream(clienteServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return clientes;
    }

    @GetMapping("/buscar-cliente/{clienteId}")
    public ResponseEntity<?> buscarClientePorId(@PathVariable(value="clienteId") Long clienteId){
        Optional<Cliente> cliente = clienteServicioImpl.findById(clienteId);
        if(!cliente.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cliente);
    }

    @PostMapping("/agregar-cliente")
    public ResponseEntity<?> agregarCliente(@RequestBody Cliente cliente){
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteServicioImpl.save(cliente));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-cliente/{clienteId}")
    public ResponseEntity<HttpStatus> eliminarCliente(@PathVariable Long clienteId){
        try{
            clienteServicioImpl.deleteById(clienteId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-cliente/{clienteId}")
    public ResponseEntity<Cliente> modificarCarne(@RequestBody Cliente cliente, @PathVariable(value="clienteId") Long clienteId){
        Optional<Cliente> clienteData = clienteServicioImpl.findById(clienteId);
        if(clienteData.isPresent()){
            clienteData.get().setClienteNombre(cliente.getClienteNombre());
            clienteData.get().setClienteLocalidad(cliente.getClienteLocalidad());
            clienteData.get().setClienteContacto(cliente.getClienteContacto());
            clienteData.get().setClienteObservaciones(cliente.getClienteObservaciones());
            return new ResponseEntity<>(clienteServicioImpl.save(clienteData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM Localidad

    @Autowired
    private LocalidadServicioImpl localidadServicioImpl;

    @GetMapping("/listar-localidades")
    public List<Localidad> listadoLocalidad(){
        List<Localidad> localidad = StreamSupport
        .stream(localidadServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return localidad;
    }

    @GetMapping("/buscar-localidad/{localidadId}")
    public ResponseEntity<?> buscarLocalidadPorId(@PathVariable(value="localidadId") Long localidadId){
        Optional<Localidad> localidad = localidadServicioImpl.findById(localidadId);
        if(!localidad.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(localidad);
    }

    @PostMapping("/agregar-localidad")
    public ResponseEntity<?> agregarLocalidad(@RequestBody Localidad localidad){
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(localidadServicioImpl.save(localidad));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-localidad/{localidadId}")
    public ResponseEntity<HttpStatus> eliminarLocalidad(@PathVariable Long localidadId){
        try{
            localidadServicioImpl.deleteById(localidadId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-localidad/{localidadId}")
    public ResponseEntity<Localidad> modificarLocalidad(@RequestBody Localidad localidad, @PathVariable(value="localidadId") Long localidadId){
        Optional<Localidad> localidadData = localidadServicioImpl.findById(localidadId);
        if(localidadData.isPresent()){
            localidadData.get().setLocalidadNombre(localidad.getLocalidadNombre());
            return new ResponseEntity<>(localidadServicioImpl.save(localidadData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM Proveedor

    @Autowired
    private ProveedorServicioImpl proveedorServicioImpl;

    @GetMapping("/listar-proveedores")
    public List<Proveedor> listadoProveedor(){
        List<Proveedor> proveedor = StreamSupport
        .stream(proveedorServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return proveedor;
    }

    @GetMapping("/buscar-proveedor/{proveedorId}")
    public ResponseEntity<?> buscarProveedorPorId(@PathVariable(value="proveedorId") Long proveedorId){
        Optional<Proveedor> proveedor = proveedorServicioImpl.findById(proveedorId);
        if(!proveedor.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(proveedor);
    }

    @PostMapping("/agregar-proveedor")
    public ResponseEntity<?> agregarProveedor(@RequestBody Proveedor proveedor){
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(proveedorServicioImpl.save(proveedor));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-proveedor/{proveedorId}")
    public ResponseEntity<HttpStatus> eliminarProveedor(@PathVariable Long proveedorId){
        try{
            proveedorServicioImpl.deleteById(proveedorId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-proveedor/{proveedorId}")
    public ResponseEntity<Proveedor> modificarLocalidad(@RequestBody Proveedor proveedor, @PathVariable(value="proveedorId") Long proveedorId){
        Optional<Proveedor> proveedorData = proveedorServicioImpl.findById(proveedorId);
        if(proveedorData.isPresent()){
            proveedorData.get().setProveedorNombre(proveedor.getProveedorNombre());
            proveedorData.get().setProveedorRUT(proveedor.getProveedorRUT());
            proveedorData.get().setProveedorContacto(proveedor.getProveedorContacto());
            proveedorData.get().setProveedorLocalidad(proveedor.getProveedorLocalidad());
            return new ResponseEntity<>(proveedorServicioImpl.save(proveedorData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

    //#region ABM Usuario

    @Autowired
    private UsuarioServicioImpl usuarioServicioImpl;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @GetMapping("/listar-usuarios")
    public List<Usuario> listadoUsuario(){
        List<Usuario> usuario = StreamSupport
        .stream(usuarioServicioImpl.findAll().spliterator(), false)
        .collect(Collectors.toList());
        return usuario;
    }

    @GetMapping("/buscar-usuario/{usuarioId}")
    public ResponseEntity<?> buscarUsuarioPorId(@PathVariable(value="usuarioId") Long usuarioId){
        Optional<Usuario> usuario = usuarioServicioImpl.findById(usuarioId);
        if(!usuario.isPresent()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }
    

    @PostMapping("/agregar-usuario")
    public ResponseEntity<?> agregarUsuario(@RequestBody Usuario usuario){
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioServicioImpl.save(usuario));
        }
        catch(Exception e){
            HashMap<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/borrar-usuario/{usuarioId}")
    public ResponseEntity<HttpStatus> eliminarUsuario(@PathVariable Long usuarioId){
        try{
            usuarioServicioImpl.deleteById(usuarioId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/modificar-usuario/{usuarioId}")
    public ResponseEntity<Usuario> modificarUsuario(@RequestBody Usuario usuario, @PathVariable(value="usuarioId") Long usuarioId){
        Optional<Usuario> usuarioData = usuarioServicioImpl.findById(usuarioId);
        if(usuarioData.isPresent()){
            usuarioData.get().setUsuarioNombre(usuario.getUsuarioNombre());
            usuarioData.get().setUsuarioContrasenia(usuario.getUsuarioContrasenia());
            return new ResponseEntity<>(usuarioServicioImpl.save(usuarioData.get()), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //#endregion

}
